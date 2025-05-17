import { Link } from "react-router-dom";
import DefaultPFP from "../assets/defaultPFP.jpg";

function UserCard({ connectedUser, isConnection }) {
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${connectedUser.username}`} className='flex flex-col items-center'>
				<img
					src={connectedUser.profilePicture || DefaultPFP}
					alt={connectedUser.name}
					className='w-24 h-24 rounded-full object-cover mb-4'
				/>
				<h3 className='font-semibold text-lg text-center text-black'>{connectedUser.name}</h3>
			</Link>
			<p className='text-gray-600 text-center'>{connectedUser.headline}</p>
			<p className='text-sm text-primary mt-2'>{connectedUser.connections?.length} connections</p>
			<button className='mt-4 bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;