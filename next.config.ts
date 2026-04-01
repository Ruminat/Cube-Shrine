import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY ?? "";
const repositoryName = repository.split("/")[1] ?? "";
const isUserPageRepository = repositoryName.endsWith(".github.io");
const pagesBasePath =
  isGithubActions && repositoryName && !isUserPageRepository ? `/${repositoryName}` : "";

export const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath || undefined
};

export default nextConfig;
