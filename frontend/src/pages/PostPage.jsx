import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthUser } from '../lib/hooks';
import Post from "../components/Post";
import Loader from '../components/Loader';
import { axiosInstance } from '../lib/axios';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';

const PostPage = () => {
    const { postId } = useParams();
    const { data: authUser, isLoading } = useAuthUser();

    const { data: post ,isLoading:postLoading} = useQuery({
      queryKey: ["post",postId],
      queryFn: async () => {
        const res = await axiosInstance.get(`/posts/${postId}`);
        return res.data;
      },   
      enabled: !!postId
    })

    if (isLoading || postLoading) {
      return <div><Loader /></div>;
    }
    if (!post) {
      return <div>Post not found</div>;
    };
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-3'>
				<Post post={post} />
			</div>
		</div>
  )
}

export default PostPage