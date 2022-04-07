import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoThumbnail, crayon, person, password } from '../../assets/images';
import { AccountState } from '../../modules/user';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import '../../lib/styles/commonStyles.css';
import useRequest from '../../lib/hooks/useRequest';
import { sendSignUp } from '../../lib/api';
import SpinerIcon from '../../components/common/SpinerIcon';
import { validateEmail } from '../../lib/utills';
import { useAuth } from '../../lib/context/AuthProvider';

interface IFormInputs {
  email: string;
  phone: string;
  password: string;
  name: string;
}

const SignUpSchema = yup
  .object({
    email: yup.string().required(),
    phone: yup.string().required(),
    password: yup.string().required(),
    name: yup.string().required(),
  })
  .required();

const SignUp = () => {
  const { account, changeAccount } = useAuth();
  const navigate = useNavigate();
  const [_sendSignUp, loading, data, err, resetSendAuthEmail] = useRequest<AccountState>(sendSignUp);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(SignUpSchema),
  });

  React.useEffect(() => {
    if (data && data.login_id) {
      changeAccount(data);
      toast.success('sign up successed!');
      navigate('/tasks');
    }
  }, [data]);

  const onSignUpSubmit: SubmitHandler<IFormInputs> = data => {
    if (account?.login_id) {
      return;
    }
    if (!validateEmail(data.email)) {
      toast.error('wrong email format!');
      return;
    }
    const email = data.email;
    const phone_number = data.phone;
    const password = data.password;
    const display_name = data.name;
    const role_id = 3;
    _sendSignUp(email, phone_number, password, display_name, role_id);
  };

  return (
    <div className='items-center flex flex-col flex-1 justify-center -mt-16'>
      <form onSubmit={handleSubmit(onSignUpSubmit)} className='flex flex-col items-center justify-center h-5/6 w-2/3'>
        <div className='flex items-center justify-start relative w-20 h-20 sm:hidden'>
          <img src={logoThumbnail} alt='Logo' className='h-full w-full' />
          <div className='h-1/3 w-1/3 absolute top-0 -right-1/4 bg-white'>
            <img src={crayon} alt='Crayon' className='h-full w-full' />
          </div>
        </div>
        <div className='font-sans font-bold text-base sm:text-lg lg:text-2xl text-white mt-6 sm:mt-8'>Create a New Account</div>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            <img src={person} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' />
          </span>
          <input
            className='w-full bg-input px-12 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Email'
            {...register('email', { required: true, maxLength: 20 })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.email?.message}</p>
        </label>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            <img src={person} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' />
          </span>
          <input
            className='w-full bg-input px-12 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Name'
            {...register('name', { required: true, maxLength: 20 })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.name?.message}</p>
        </label>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            <img src={person} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' />
          </span>
          <input
            className='w-full bg-input px-12 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Phone Number'
            {...register('phone', { required: true, maxLength: 20 })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.phone?.message}</p>
        </label>
        <label className='mt-6 w-full relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-6'>
            <img src={password} alt='Crayon' className='h-auto w-4 sm:w-6 lg:w-8' />
          </span>
          <input
            className='w-full bg-input px-4 py-2 rounded-full text-center text-white placeholder:text-white'
            placeholder='Enter Password'
            type={'password'}
            {...register('password', { required: true, min: 6, max: 25, pattern: /^[A-Za-z]+$/i })}
          />
          <p className='text-sm px-6 text-rouge-blue'>{errors.password?.message}</p>
        </label>
        {/* <label className='mt-6 w-full'>
          <p className='text-center text-black text-base font-bold underline decoration-solid'>Forget password?</p>
        </label> */}
        <div className='mt-6 w-3/4'>
          {loading ? (
            <div className='w-full bg-submit py-2 rounded-full text-center'>
              <SpinerIcon />
            </div>
          ) : (
            <button type='submit' className='w-full bg-submit py-2 rounded-full text-center text-white'>
              Sign Up
            </button>
          )}
        </div>
        <label className='mt-6 w-3/4'>
          <p className='text-center text-white text-base font-bold underline decoration-solid' onClick={() => navigate('/login')}>
            Already account yet?
          </p>
        </label>
      </form>
    </div>
  );
};

export default SignUp;
