export const initialStore=()=>{
  return{
    all_activities: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'activities':
      return {
        ...store,
        all_activities: action.payload
      };
    
    default:
      throw Error('Unknown action.');
  }    
}
