import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { isNotEmpty } from 'ramda-adjunct';

import { setSession } from '@helpers/features/session/session.slice';
import Form from '@components/shop/Form';
import { selectIsUserLoggedIn } from '@helpers/features/session/session.selector';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import useAppSelector from '@hooks/redux/useAppSelector';
import InputLabel from '@components/headlessUI/Form/InputLabel';
import { useAuthSessionMutation } from '@helpers/features/session/session.api';
import ButtonLoading from '@components/headlessUI/ButtonLoading';
import PageContainer from 'layouts/PageContainer';

import { ISigninInputs } from './Login.types';

const Login = () => {
  const navigate = useNavigate();

  const selectedIsUserLoggedIn = useAppSelector(selectIsUserLoggedIn);

  useLayoutEffect(() => {
    if (selectedIsUserLoggedIn === true) {
      navigate('/');
    }
  }, [navigate, selectedIsUserLoggedIn]);

  const dispatch = useAppDispatch();
  const [errorCode, setErrorCode] = useState('');

  const [authSession, { isLoading: isLoadingAuthSession }] =
    useAuthSessionMutation();

  const methods = useForm<ISigninInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const allFields = useWatch({ control: methods.control });

  const onSubmit: SubmitHandler<ISigninInputs> = async (data) => {
    try {
      const session = await authSession({
        username: data.username,
        password: data.password,
      }).unwrap();

      // Load session into the store

      if (session.data !== undefined) {
        dispatch(setSession(session.data));
        // On success login
        navigate('/');
      } else {
        setErrorCode('credentials_error');
      }
    } catch (error) {
      setErrorCode('credentials_error');
    }
  };

  useEffect(() => {
    setErrorCode('');
  }, [allFields]);

  return (
    <PageContainer
      seo={{
        title: 'Login',
        subtitle: 'Sign in to your account',
        description: 'Sign in to your account!',
      }}
    >
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mt-16 mx-auto overflow-hidden">
          <div className="w-full bg-gray-800 border border-gray-700 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-100 md:text-2xl">
                Sign in to your account
              </h1>

              <Form
                className="space-y-4 md:space-y-6"
                methods={methods}
                onSubmit={onSubmit}
              >
                <InputLabel
                  id="username"
                  type="text"
                  label="Your username"
                  placeholder="abc@email.com"
                  autoComplete="username"
                  required
                />
                <InputLabel
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  autoComplete="password"
                  required
                />
                {isNotEmpty(errorCode) && (
                  <p className="!mt-[10px] text-sm text-left text-red-600">
                    * Usuario y/o contraseña incorrectos
                  </p>
                )}
                <ButtonLoading
                  type="submit"
                  className="w-full px-5 py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-900 focus:ring-4 focus:outline-none hover:bg-cyan-950 focus:ring-cyan-950"
                  loading={isLoadingAuthSession}
                >
                  Sign in
                </ButtonLoading>
                <p className="text-sm font-light text-gray-400">
                  Don't have an account yet?
                  <Link
                    to="#"
                    className="ml-1 font-medium text-gray-100 hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Login;
