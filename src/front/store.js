export const initialStore = () => {
  return {
    all_reports:[],
    all_activities: [],
    activity: {},
    user: {
      id: null,
      username: "",
      avatar_url: "",
      is_professional: true,
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
	
    case "activities":
      return {
        ...store,
        all_activities: action.payload,
      };
    case "activity":
      return {
        ...store,
        activity: action.payload,
      };
    case "loadUser":
      return {
        ...store,
        user: action.payload,
      };
    case "closeSession":
      localStorage.clear();
      return {
        ...store,
        user: { id: null, username: "", avatar_url: "" },
        closed: true,
      };
      case "reports":
      return {
        ...store,
        all_reports: action.payload,
      };
    default:
      throw Error("Unknown action.");
  }
}
