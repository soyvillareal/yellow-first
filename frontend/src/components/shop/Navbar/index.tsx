import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { BiLogIn } from 'react-icons/bi';

import useAppSelector from '@hooks/redux/useAppSelector';
import { selectIsUserLoggedIn } from '@helpers/features/session/session.selector';
import { selectCartTransaction } from '@helpers/features/transaction/transaction.selector';
import CustomSelect from '@components/headlessUI/CustomSelect';
import i18n, { languages } from '@helpers/i18n';
import { configSite, languageLabels } from '@helpers/constants';

import Logout from './Logout';

const Navbar = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage);
  const selectedIsUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
  const selectedCartTransaction = useAppSelector(selectCartTransaction);

  const handleChangeLanguage = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const lang = event.target.value;
      setLanguage(lang);
      i18n.changeLanguage(lang);
    },
    [],
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-30 py-2 overflow-hidden bg-gray-900">
      <div aria-label="Top" className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <div className="flex overflow-hidden sm:ml-4 lg:ml-0 w-full">
              <NavLink className="flex" to="/">
                <span className="sr-only">{configSite.name}</span>
                <img
                  className="size-12"
                  src="/logo.png"
                  alt={configSite.name}
                />
              </NavLink>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex flex-row items-center justify-center ml-4 lg:ml-6">
                <NavLink to="cart" className="flex items-center p-2 -m-2 group">
                  <ShoppingBagIcon
                    className="flex-shrink-0 w-6 h-6 text-gray-100 group-hover:text-gray-50"
                    aria-hidden="true"
                  />
                  <span className="ml-1 text-xs font-medium text-gray-100 sm:ml-2 sm:text-sm group-hover:text-gray-50">
                    {selectedCartTransaction.products.length}
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </NavLink>
              </div>
              {selectedIsUserLoggedIn && (
                <>
                  <span
                    className="block w-px h-6 ml-4 bg-gray-700 lg:ml-6"
                    aria-hidden="true"
                  />
                  <div className="flow-root ml-4 lg:ml-6 min-w-[120px] whitespace-nowrap">
                    <Logout />
                  </div>
                </>
              )}
              {selectedIsUserLoggedIn === false && (
                <>
                  <span
                    className="hidden w-px h-6 ml-4 bg-gray-700 md:block lg:ml-6"
                    aria-hidden="true"
                  />
                  <div className="flow-root ml-4 lg:ml-6 md:mr-4">
                    <NavLink
                      to="login"
                      className="flex items-center justify-center p-2 px-3 py-2 -m-2 text-sm font-medium text-gray-100 rounded-lg bg-gray-50 bg-opacity-10 hover:bg-transparent hover:text-white group md:min-w-[120px] whitespace-nowrap"
                    >
                      <span className="hidden md:block">
                        {t('navbar.logIn')}
                      </span>
                      <BiLogIn
                        title="log in"
                        className="flex-shrink-0 w-6 h-6 md:ml-2 text-gray-100 group-hover:text-white"
                        aria-hidden="true"
                      />
                    </NavLink>
                  </div>
                </>
              )}
              <span
                className="hidden w-px h-6 ml-2 bg-gray-700 md:block"
                aria-hidden="true"
              />
              <CustomSelect
                id="language"
                className="w-[95px] ml-4"
                selectClassName="py-2"
                onChange={handleChangeLanguage}
                options={languages.map((language) => ({
                  value: language,
                  label: languageLabels[language],
                }))}
                value={language}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
