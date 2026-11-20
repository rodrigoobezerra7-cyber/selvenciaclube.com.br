import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Time "mo:core/Time";
import EmailClient "mo:caffeineai-email/emailClient";
import Types "../types";

module {
  // Validade do código de recuperação: 15 minutos.
  func recoveryTtlNanos() : Int = 15 * 60 * 1_000_000_000;
  // Tentativas de código errado antes de o código ser descartado.
  func maxRecoveryAttempts() : Nat = 5;
  // A member code is 3 to 32 characters of letters, digits, spaces, dashes or
  // underscores, and must contain at least one letter or digit.
  public func isValidCode(code : Text) : Bool {
    let trimmed = code.trim(#predicate(func c = c == ' '));
    let size = trimmed.size();
    if (size < 3 or size > 32) {
      return false;
    };
    var hasAlnum = false;
    for (c in trimmed.chars()) {
      if (c.isAlphabetic() or c.isDigit()) {
        hasAlnum := true;
      } else if (c != ' ' and c != '-' and c != '_') {
        return false;
      };
    };
    hasAlnum;
  };

  public func normalizeCode(code : Text) : Text {
    code.trim(#predicate(func c = c == ' ')).toLower();
  };

  public func isCodeTaken(members : Map.Map<Principal, Types.Member>, code : Text) : Bool {
    let normalized = normalizeCode(code);
    members.values().any(func m = normalizeCode(m.code) == normalized);
  };

  public func getProfile(members : Map.Map<Principal, Types.Member>, caller : Principal) : ?Types.Member {
    members.get(caller);
  };

  // Stores the verified email from the signed-in identity on the member's
  // profile. A member who has not registered yet is left untouched; the email
  // is captured again on the next sign-in after registration.
  public func setVerifiedEmail(
    members : Map.Map<Principal, Types.Member>,
    caller : Principal,
    email : Text,
  ) {
    switch (members.get(caller)) {
      case (?member) {
        members.add(caller, { member with email = ?email });
      };
      case null {};
    };
  };

  public func register(
    members : Map.Map<Principal, Types.Member>,
    caller : Principal,
    code : Text,
    email : ?Text,
  ) : Result.Result<Types.Member, Types.MemberError> {
    if (not isValidCode(code)) {
      return #err(#invalidCode);
    };
    if (isCodeTaken(members, code)) {
      return #err(#codeTaken);
    };
    let trimmed = code.trim(#predicate(func c = c == ' '));
    let member : Types.Member = {
      id = caller;
      code = trimmed;
      email;
      registeredAt = Time.now();
    };
    members.add(caller, member);
    #ok(member);
  };

  public func isValidEmail(email : Text) : Bool {
    let trimmed = email.trim(#predicate(func c = c == ' '));
    let parts = trimmed.split(#char('@')).toArray();
    if (parts.size() != 2) {
      return false;
    };
    let local = parts[0];
    let domain = parts[1];
    local.size() > 0 and domain.size() >= 3 and domain.contains(#char('.'));
  };

  // Código numérico de 6 dígitos derivado do relógio e do chamador.
  func newRecoveryCode(caller : Principal) : Text {
    let now = Time.now();
    let seed = (now % 1_000_000_000_000_000).toNat() + caller.hash().toNat();
    let value = seed % 1_000_000;
    let digits = value.toText();
    var padded = digits;
    var i = digits.size();
    while (i < 6) {
      padded := "0" # padded;
      i += 1;
    };
    padded;
  };

  func recoveryEmailBody(code : Text) : Text {
    "<p>Olá, membro SELVÊNCIA.</p>" #
    "<p>Recebemos um pedido de recuperação de acesso à Central de Operações.</p>" #
    "<p>Seu código de verificação é: <strong>" # code # "</strong></p>" #
    "<p>O código expira em 15 minutos. Se você não fez este pedido, ignore esta mensagem.</p>";
  };

  // Envia um código de verificação para o e-mail informado e o guarda para
  // validação posterior. O e-mail precisa pertencer a um membro registrado.
  public func requestRecovery(
    members : Map.Map<Principal, Types.Member>,
    recoveries : Map.Map<Principal, Types.RecoveryRequest>,
    caller : Principal,
    email : Text,
  ) : async Result.Result<(), Types.RecoveryError> {
    let member = switch (members.get(caller)) {
      case (?m) { m };
      case null { return #err(#notRegistered) };
    };
    let trimmed = email.trim(#predicate(func c = c == ' '));
    if (not isValidEmail(trimmed)) {
      return #err(#invalidEmail);
    };
    switch (member.email) {
      case (?registered) {
        if (registered.toLower() != trimmed.toLower()) {
          return #err(#invalidEmail);
        };
      };
      case null { return #err(#noEmail) };
    };
    let code = newRecoveryCode(caller);
    let result = await EmailClient.sendServiceEmail(
      "no-reply",
      [trimmed],
      "SELVÊNCIA — código de recuperação de acesso",
      recoveryEmailBody(code),
    );
    switch (result) {
      case (#ok) {
        recoveries.add(caller, {
          code;
          expiresAt = Time.now() + recoveryTtlNanos();
          attempts = 0;
        });
        #ok(());
      };
      case (#err(error)) { #err(#emailFailed(error)) };
    };
  };

  // Valida o código enviado e o consome, liberando a definição do novo acesso.
  public func verifyRecoveryCode(
    recoveries : Map.Map<Principal, Types.RecoveryRequest>,
    caller : Principal,
    code : Text,
  ) : Result.Result<(), Types.RecoveryError> {
    let request = switch (recoveries.get(caller)) {
      case (?r) { r };
      case null { return #err(#invalidCode) };
    };
    if (Time.now() > request.expiresAt) {
      recoveries.remove(caller);
      return #err(#codeExpired);
    };
    if (request.attempts >= maxRecoveryAttempts()) {
      recoveries.remove(caller);
      return #err(#tooManyAttempts);
    };
    if (request.code != code.trim(#predicate(func c = c == ' '))) {
      recoveries.add(caller, { request with attempts = request.attempts + 1 });
      return #err(#invalidCode);
    };
    recoveries.remove(caller);
    #ok(());
  };

  // Confirma a recuperação: o acesso é a identidade da plataforma, então o
  // código validado é o que autoriza a reativação do perfil do membro.
  public func completeRecovery(
    members : Map.Map<Principal, Types.Member>,
    recoveries : Map.Map<Principal, Types.RecoveryRequest>,
    caller : Principal,
    code : Text,
  ) : Result.Result<Types.Member, Types.RecoveryError> {
    switch (verifyRecoveryCode(recoveries, caller, code)) {
      case (#err(e)) { return #err(e) };
      case (#ok) {};
    };
    switch (members.get(caller)) {
      case (?member) { #ok(member) };
      case null { #err(#notRegistered) };
    };
  };
};
