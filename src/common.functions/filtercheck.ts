export const filterChecks = (filterFields: {[key: string]: any}) => {
  const filters: { [key: string]: any }  = {};
  Object.keys(filterFields).forEach((field) => {
    const value = filterFields[field];
    if (value !== undefined && value !== '') {
      filters[field] = value;
    }
  });

  return filters;
};
