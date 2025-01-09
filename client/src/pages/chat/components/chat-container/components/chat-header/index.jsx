import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { RiCloseFill } from 'react-icons/ri'

const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between md:px-20 px-10'>
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className='w-12 h-12 relative'>
            {
              selectedChatType === "contact" ? (
                <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                {selectedChatData?.image ? (
                    <AvatarImage
                        src={`${selectedChatData.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.png";
                        }}
                    />
                    ) : (
                        <div
                            className={`uppercase h-12 w-12 text-lg border-[.5px] flex items-center justify-center rounded-full ${getColor(
                                selectedChatData?.color
                            )}`}
                        >
                            {selectedChatData?.firstname
                                ? selectedChatData.firstname[0].toUpperCase()
                                : selectedChatData?.email?.[0]?.toUpperCase() || "N"}
                        </div>
                    )}
                </Avatar>
              ) : (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
              )
            }
          </div>
          <div>
            {selectedChatType === "contact" ? (selectedChatData.firstname ? `${selectedChatData.firstname} ${selectedChatData.lastname}` : `${selectedChatData.email}`) : (selectedChatData.name)}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={closeChat}>
            <RiCloseFill className='text-3xl'/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
