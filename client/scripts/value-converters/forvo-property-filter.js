export class ForvoPropertyFilterValueConverter {
  toView(listOfWordProps, property, val) {
    if (listOfWordProps === undefined || listOfWordProps === null || listOfWordProps.length === 0 
        || property === undefined || property === null || property === ''
        || val === undefined || val === null || val === '') {
          return listOfWordProps;
    }
    
    return listOfWordProps.filter((prop) => prop[property].toLowerCase() === val.toLowerCase());
  }
}