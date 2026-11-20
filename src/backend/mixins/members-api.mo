import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Types "../types";
import MembersLib "../lib/members";

mixin (members : Map.Map<Principal, Types.Member>, recoveries : Map.Map<Principal, Types.RecoveryRequest>) {
  public query ({ caller }) func getMyProfile() : async ?Types.Member {
    MembersLib.getProfile(members, caller);
  };

  public shared ({ caller }) func registerMember(code : Text, email : ?Text) : async Result.Result<Types.Member, Types.MemberError> {
    MembersLib.register(members, caller, code, email);
  };

  public shared ({ caller }) func requestRecoveryCode(email : Text) : async Result.Result<(), Types.RecoveryError> {
    await MembersLib.requestRecovery(members, recoveries, caller, email);
  };

  public shared ({ caller }) func verifyRecoveryCode(code : Text) : async Result.Result<(), Types.RecoveryError> {
    MembersLib.verifyRecoveryCode(recoveries, caller, code);
  };

  public shared ({ caller }) func completeRecovery(code : Text) : async Result.Result<Types.Member, Types.RecoveryError> {
    MembersLib.completeRecovery(members, recoveries, caller, code);
  };
};
