import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Atomic value types
  type Timestamp = Int;
  type ProductType = { #tShirt; #hat; #mug; #custom };
  type Size = { width : Float; height : Float };
  type DesignElementType = { #text; #image; #shape };
  type Position = { x : Float; y : Float };
  type Color = Text;

  // Design element record
  type DesignElement = {
    elementType : DesignElementType;
    position : Position;
    size : Size;
    content : Text;
    color : Color;
  };

  type ProjectId = Text;

  type CustomizelyProject = {
    projectId : Text;
    owner : Principal;
    productType : ProductType;
    baseColor : Color;
    designElements : [DesignElement];
    created : Timestamp;
    name : Text;
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Initialize access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles map
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Projects map: projectId -> CustomizelyProject
  let projects = Map.empty<ProjectId, CustomizelyProject>();

  // --- User Profile Functions ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Design Project Functions ---

  // Save a project (authenticated users only)
  public shared ({ caller }) func saveProject(
    projectId : Text,
    productType : Text,
    baseColor : Color,
    designElements : [DesignElement],
    name : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save projects");
    };

    switch (projects.get(projectId)) {
      case (?existing) {
        if (existing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this project");
        };
      };
      case null {};
    };

    let newProject : CustomizelyProject = {
      projectId;
      owner = caller;
      productType = switch (productType) {
        case ("tShirt") { #tShirt };
        case ("hat") { #hat };
        case ("mug") { #mug };
        case ("custom") { #custom };
        case (_) {
          Runtime.trap("Invalid project type. Select tShirt, hat, mug or custom");
        };
      };
      baseColor;
      designElements;
      created = Time.now();
      name;
    };
    projects.add(projectId, newProject);
  };

  // Get all projects belonging to the caller (users see own; admins see all)
  public query ({ caller }) func getMyProjects() : async [CustomizelyProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve projects");
    };
    let entries = projects.toArray();
    let filtered : List.List<(ProjectId, CustomizelyProject)> = List.fromArray<(ProjectId, CustomizelyProject)>(entries).filter(
      func((_, p)) { p.owner == caller }
    );
    filtered.map<(ProjectId, CustomizelyProject), CustomizelyProject>(func((_, p)) { p }).toArray();
  };

  // Get all projects (admin only)
  public query ({ caller }) func getAllProjects() : async [CustomizelyProject] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can retrieve all projects");
    };
    let entries = projects.toArray();
    let mapped : List.List<(ProjectId, CustomizelyProject)> = List.fromArray<(ProjectId, CustomizelyProject)>(entries);
    mapped.map<(ProjectId, CustomizelyProject), CustomizelyProject>(func((_, p)) { p }).toArray();
  };

  // Get a single project by ID (owner or admin)
  public query ({ caller }) func getProject(projectId : Text) : async ?CustomizelyProject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve projects");
    };
    switch (projects.get(projectId)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this project");
        };
        ?project;
      };
      case null { null };
    };
  };

  // Delete a project (owner or admin)
  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };
    switch (projects.get(projectId)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this project");
        };
        projects.remove(projectId);
      };
      case null {
        Runtime.trap("Project not found");
      };
    };
  };
};
