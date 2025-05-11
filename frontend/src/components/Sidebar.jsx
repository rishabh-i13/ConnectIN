import { Link } from "react-router-dom";
import { IoHome, IoNotifications } from 'react-icons/io5';
import { BsFillPeopleFill } from 'react-icons/bs';
import DefaultBanner from "../assets/defaultbanner.jpg";
import DefaultPFP from "../assets/defaultPFP.jpg";


export default function Sidebar({ user }) {
	return (
		<div className='bg-white rounded-lg shadow'>
			<div className='p-4 text-center'>
				<div
					className='h-16 rounded-t-lg bg-cover bg-center '
					style={{
						backgroundImage: `url("${user.bannerImg || DefaultBanner}")`,
					}}
				/>
				<Link to={`/profile/${user.username}`}>
					<img
						src={user.profilePicture || DefaultPFP}
						alt={user.name}
						className='w-20 h-20 rounded-full mx-auto mt-[-40px]'
					/>
					<h2 className='text-xl font-semibold mt-2 text-[#360072]'>{user.name}</h2>
				</Link>
				<p className='text-info text-'>{user.headline}</p>
				<p className='text-info text-xs'>{user.connections.length} connections</p>
			</div>
			<div className='border-t border-base-100 p-4'>
				<nav>
					<ul className='space-y-2'>
						<li>
							<Link
								to='/'
								className='flex items-center text-black py-2 px-4 rounded-md hover:bg-gradient-to-r from-[#360072] to-[#8E00F4] hover:text-white transition-colors'
							>
								<IoHome className='mr-2' size={20} /> Home
							</Link>
						</li>
						<li>
							<Link
								to='/network'
								className='flex items-center text-black py-2 px-4 rounded-md hover:bg-gradient-to-r from-[#360072] to-[#8E00F4] hover:text-white transition-colors'
							>
								<BsFillPeopleFill className='mr-2' size={20} /> My Network
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='flex items-center text-black py-2 px-4 rounded-md hover:bg-gradient-to-r from-[#360072] to-[#8E00F4] hover:text-white transition-colors'
							>
								<IoNotifications className='mr-2' size={20} /> Notifications
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div className='border-t border-base-100 p-4 text-[#360072]'>
				<Link to={`/profile/${user.username}`} className='text-sm font-semibold'>
					Visit your profile
				</Link>
			</div>
		</div>
	);
}