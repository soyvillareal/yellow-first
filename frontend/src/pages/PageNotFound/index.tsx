import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import PageContainer from 'layouts/PageContainer';

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      seo={{
        title: t('SEO.pageNotFound.title'),
        subtitle: t('SEO.pageNotFound.subtitle'),
        description: t('SEO.pageNotFound.description'),
      }}
    >
      <main className="grid min-h-full px-6 py-40 place-items-center sm:py-48 lg:px-8">
        <div className="w-3/4 text-center sm:w-1/2">
          <p className="text-2xl font-semibold text-cyan-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            {t('pageNotFound.title')}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-400">
            {t('pageNotFound.description')}
          </p>
          <div className="flex items-center justify-center mt-10 gap-x-6">
            <Link
              to="/"
              className="w-full sm:w-1/4 px-5 block py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-900 focus:ring-4 focus:outline-none hover:bg-cyan-950 focus:ring-cyan-950"
            >
              {t('pageNotFound.backHome')}
            </Link>
          </div>
        </div>
      </main>
    </PageContainer>
  );
};

export default PageNotFound;
