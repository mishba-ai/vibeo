import Recommendations from './Recommendations'
import Spaces from './Spaces'
import Suggestion from './Suggestion'
export default function () {
    return (
        <div className='bg-red- sticky top-0'>
          
            <div className='flex flex-col '>
                <Spaces />
                <Suggestion />
                <Recommendations/>
            </div>


        </div>
    )
}
