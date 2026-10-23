import React from "react";
import { PageDescription, PageTitle } from "./Common";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <>
      <PageTitle title={title} />
      <PageDescription description={description} />
    </>
  );
};

export default PageHeader;
