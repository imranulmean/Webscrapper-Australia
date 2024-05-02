import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/products/getproducts');
      const data = await res.json();
      setProducts(data.products);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <section class="bg-center bg-no-repeat bg-[url('https://media.licdn.com/dms/image/D5612AQEMBc-WygyG6Q/article-cover_image-shrink_720_1280/0/1657089972204?e=2147483647&v=beta&t=uXIEblHuMzT27b_3hFSlsNtqnh2s5gLxiksnDTmX08o')] bg-blend-multiply">
          <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
              <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0" style={{'padding':'90px'}}>
                  <Link to="/search" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-zinc-950 hover:bg-zinc-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                    View all products
                      <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                  </Link>  
              </div>
          </div>
      </section>      


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {products && products.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Featured Products</h2>
            <div className='flex flex-wrap gap-4'>
              {products.map((product) => (
                <PostCard key={product._id} post={product} />
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
              View all Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
