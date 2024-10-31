/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false
  modularizeImports: {
    "react-icons/?(((\\w*)?/?)*)": {
      transform: "@react-icons/all-files/{{ matches.[1] }}/{{ member }}",
      skipDefaultConversion: true,
    },
  },
};

export default nextConfig;
