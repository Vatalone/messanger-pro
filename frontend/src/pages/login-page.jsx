import { useContext, useState } from "react"
import {useForm} from 'react-hook-form'
import assets from "../assets/assets"
import { AuthContext } from "../../context/AuthContext";

export const LoginPage = () => {
	const [state, setState] = useState('Sign up');
	const [isDataSubmitted, setIsDataSubmitted] = useState(false);

	const {login} = useContext(AuthContext);

	const {register, handleSubmit, reset} = useForm({});
	const onSubmit = async(data) => {
		console.log(data);
		if(state === 'Sign up' && !isDataSubmitted) {
			setIsDataSubmitted(true)
			return;
		}
		login(state === 'Sign up' ? 'signup' : 'login', data);
	};
	return (
		<div className="flex min-h-screen bg-cover bg-center items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

			<img src={assets.logo_big} alt="" className="w-[250px]" />
			
			<form onSubmit={handleSubmit(onSubmit)} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
				<h2 className="font-medium text-2xl flex justify-between items-center">
					{state}
					{isDataSubmitted && <img onClick={() => {setIsDataSubmitted(false)}} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
				</h2>

				{state === 'Sign up' && !isDataSubmitted && (
					<>
					<input {...register('fullName', {required: true})} type="text" placeholder="Full Name" required className="p-2 border border-gray-500 rounded-md focus:outline-none" />
					</>
				)}
				{!isDataSubmitted && (
					<>
					<input {...register('email', {required: true})} type="email" placeholder="Email Address" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
					<input {...register('password', {required: true})} type="password" placeholder="Password" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
					</>
				)}
				{state === 'Sign up' && isDataSubmitted && (
					<>
					<textarea rows={4} {...register('bio', {required: true})} type="text" placeholder="Bio" required className="p-2 border border-gray-500 rounded-md focus:outline-none" />
					</>
				)}

				<button className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">{state === 'Sign up' ? "Create Account" : 'Login Now'}</button>

				<div className="flex items-center gap-2 text-sm text-gray-500">
					<input type="checkbox" required />
					<p>Agree to the terms of use & privacy policy.</p>
				</div>

				<div className="flex flex-col gap-2">
					{state === 'Sign up' ? (
						<p className="text-sm text-gray-600">Already have an account? <span onClick={() => {setState('Login'); setIsDataSubmitted(false); reset()}} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
					) : (
						<p className="text-sm text-gray-600">Create an account <span onClick={() => {setState('Sign up'); reset()}} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
					)}
				</div>
			</form>
		</div>
	)
}