import { PropsWithChildren } from 'react';

import HelmetAsync from '@components/shop/HelmetAsync';
import { configSite } from '@helpers/constants';
import Loader from '@components/atoms/Loader';

import { IPageContainerProps } from './PageContainer.types';

const PageContainer = ({
  children,
  loading = false,
  seo,
}: PropsWithChildren<IPageContainerProps>) => {
  return (
    <div className="block relative">
      <HelmetAsync>
        <title>{`${seo.title ? seo.title : configSite.name} - ${
          seo.subtitle
        }`}</title>
        {seo.description && (
          <meta name="description" content={seo.description} />
        )}
        {seo.keywords && (
          <meta name="keywords" content={seo.keywords.join(',')} />
        )}
        {seo.openGraph && (
          <>
            <meta property="og:title" content={seo.openGraph.title} />
            <meta
              property="og:description"
              content={seo.openGraph.description}
            />
            <meta property="og:image" content={seo.openGraph.image} />
            <meta property="og:url" content={seo.openGraph.url} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={seo.openGraph.language} />
            <meta property="og:site_name" content={configSite.name} />
            <meta property="og:see_also" content={seo.openGraph.url} />
          </>
        )}
        {seo.twitter && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={configSite.url} />
            {seo.twitter.creator && (
              <meta name="twitter:creator" content={seo.twitter.creator} />
            )}
            <meta name="twitter:title" content={seo.twitter.title} />
            <meta
              name="twitter:description"
              content={seo.twitter.description}
            />
            <meta name="twitter:image" content={seo.twitter.image} />
            <meta name="twitter:url" content={seo.twitter.url} />
          </>
        )}
      </HelmetAsync>
      {loading ? <Loader /> : children}
    </div>
  );
};

export default PageContainer;
