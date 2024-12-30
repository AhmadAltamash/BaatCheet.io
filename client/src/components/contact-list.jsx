import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({contacts, isChannel = false}) => {

    const { selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType, setSelectedChatMessages } = useAppStore();

    console.log(contacts)

    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact"); 
        setSelectedChatData(contact);

        if(selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }

    }

  return (
    <div className="mt-5">{contacts.map((contact) => (
        <div className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} key={contact._id} onClick={() => handleClick(contact)}>
            <div className="flex gap-5 items-center justify-start text-neutral-300">
                {!isChannel && (
                    <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                    {contact?.image ? (
                        <AvatarImage
                            src={`${HOST}${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-image.png";
                                }}
                            />
                        ) : (
                            <div
                                className={`${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border border-white/70" : getColor(contact?.color)} uppercase h-10 w-10 text-lg border-[.5px] flex items-center justify-center rounded-full`}
                            >
                                {contact?.firstname
                                    ? contact.firstname[0].toUpperCase()
                                    : contact?.email?.[0]?.toUpperCase() || "N"}
                            </div>
                        )}
                    </Avatar>
                )}
                {
                    isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                }
                {
                    isChannel ? <span>{contact.name}</span> : <span>{contact.firstname ? `${contact.firstname} ${contact.lastname}` : `${contact.email}`}</span>
                }
            </div>
        </div>
    ))}
    </div>
  )
}

export default ContactList