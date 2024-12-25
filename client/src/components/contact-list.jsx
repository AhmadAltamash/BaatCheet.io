import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({contacts, isChannel = false}) => {

    const { selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType, setSelectedChatMessages } = useAppStore();

    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType("channel");
        else selectedChatType("contact"); 
        setSelectedChatData(contact);

        if(selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }

    }

  return (
    <div className="mt-5">{contacts.map((contact) => (
        <div className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData & selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} key={contact._id} onClick={() => handleClick(contact)}>
            <div className="flex gap-5 items-center justify-start text-neutral-300">
                {!isChannel && <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                    {selectedChatData?.image ? (
                        <AvatarImage
                            src={`${HOST}${selectedChatData.image}`}
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
                }
            </div>
        </div>
    ))}
    </div>
  )
}

export default ContactList