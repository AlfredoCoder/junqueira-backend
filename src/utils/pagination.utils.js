


export const getPagination = (page = 1, limit = 10) => {
  const take = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (Number(page) - 1) * take;

  return { skip, take };
};

export const getPagingData = (totalItems, page, limit) => {
  const currentPage = Number(page);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
