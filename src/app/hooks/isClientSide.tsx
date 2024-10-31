const isClientSide = (): boolean => {
  return typeof window !== "undefined";
};

export default isClientSide;
