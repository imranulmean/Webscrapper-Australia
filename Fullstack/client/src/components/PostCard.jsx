import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    // <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[330px] transition-all'>
    //   <Link to={`/post/${post.productUrl}`}>
    //     <img src={post.productImage} alt='post cover'
    //       className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
    //     />
    //   </Link>
    //   <div className='p-3 flex flex-col gap-2'>
    //     <p className='text-lg font-semibold line-clamp-2'>{post.productTitle}</p>
    //     <span className='italic text-sm'>{post.shop}</span>
    //     <Link
    //       to={`/post/${post.productUrl}`}
    //       className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
    //     >
    //       Read article
    //     </Link>
    //   </div>
    // </div>
      <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 md:w-[250px]">
          <Link to={`/post/${post.productUrl}`}>
              <img class="p-8 rounded-t-lg" src={post.productImage} alt="product image" />
          </Link>
          <div class="px-5 pb-5">
              <Link to="/">
                  <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{post.productTitle}</h5>
              </Link>
              <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-600 dark:text-white">{post.shop}</span>
              </div>
              <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-gray-900 dark:text-white">${post.productPrice}</span>
              </div>
          </div>
      </div>    
  );
}
