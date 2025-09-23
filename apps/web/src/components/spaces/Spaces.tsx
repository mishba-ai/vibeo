
export default function Spaces() {

  const spaceList = [
    {
      image: 'https://i.pinimg.com/736x/70/80/3e/70803e0885cc738d4e17a444f296a317.jpg',
      hostedBy: 'john adam xender'
    },
    {
      image: 'https://i.pinimg.com/736x/ef/15/32/ef15323fd7fcc7af4a983ee04de674ea.jpg',
      hostedBy: 'ruhi '
    },
    {
      image: 'https://i.pinimg.com/736x/b4/1f/24/b41f248ea356a219e23847075cfccb46.jpg',
      hostedBy: 'jay palfrey'
    },
    {
      image: 'https://i.pinimg.com/736x/b4/1f/24/b41f248ea356a219e23847075cfccb46.jpg',
      hostedBy: 'jay palfrey'
    }
  ]

  return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden bg-yellow- transition-transform scale-90">
        <h1 className="text-xl font-bold">Spaces</h1>
      <ul className="flex  w-auto gap-x-4 px-1">
        {spaceList.map((space, index) => (
          <li className='w-26 h-36 mt-4 rounded-xl flex-shrink-0 bg-blue-100  transition-transform  scale-100 relative flex justify-center' key={index} >
            <div className=" w-24 h-6 bg-white px-1 rounded-full flex items-center gap-x-1 absolute bottom-2 ">
              <img src={space.image} alt="" className="rounded-full w-5 h-5" />
              <p className="text-xs text-gray-800 truncate flex-1 text-center">{space.hostedBy}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
