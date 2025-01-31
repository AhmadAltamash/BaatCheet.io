import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { animationDefaultOptions, getColor } from "@/lib/utils"
import Lottie from "react-lottie"
import { apiClient } from "@/lib/api-client"
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
  
const NewDM = () => {

    const { setSelectedChatType, setSelectedChatData } = useAppStore();

    const [openNewContactModel, setOpenNewContactModel] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])

    const searchContacts = async (searchTerm) => {
        try {
            if(searchTerm.length > 0){
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, {searchTerm}, {withCredentials: true})
                if(response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log({ error })
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModel(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([])
    }

  return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModel(true)}/>
                </TooltipTrigger>
                <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white' >
                Select New Contact
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
            <DialogContent className="bg-[#181920] border-none text-white md:w-[400px] md:h-[400px] h-[300px] w-[300px] flex flex-col">
                <DialogHeader>
                <DialogTitle>Please Select a Contact</DialogTitle>
                <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input
                        placeholder="Search Contacts"
                        className="rounded-lg p-6 bg-[#2c2e3b] border-none outline-none focus:outline-purple-500 focus:border-purple-500"
                        onChange={(e) => searchContacts(e.target.value)}
                    />
                </div>
                <ScrollArea>
                    <div className="flex flex-col gap-5">
                        { searchedContacts.map((contact) => (
                            <div key={contact._id} className="flex gap-3 items-center cursor-pointer hover:bg-[#2c2e3b] p-2 rounded-md" onClick={() => selectNewContact(contact)}>
                                <div className='w-12 h-12 relative'>
                                    <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                        {contact?.image ? (
                                            <AvatarImage
                                                src={`${contact.image}`}
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
                                                    contact?.color
                                                )}`}
                                            >
                                                {contact?.firstname
                                                    ? contact.firstname[0].toUpperCase()
                                                    : contact?.email?.[0]?.toUpperCase() || "N"}
                                            </div>
                                        )}
                                    </Avatar>
                                </div>
                                <div className="flex flex-col">
                                   <span>
                                   {contact.firstname && contact.lastname ? 
                                    `${contact.firstname} ${contact.lastname}` :
                                    ""} 
                                   </span>
                                   <span className="text-xs">{contact.email}</span>
                                </div> 
                            </div>
                        )) }
                    </div>
                </ScrollArea>
                {
                    searchedContacts.length <= 0 &&  <div className="flex-1 bg-transparent md:flex flex-col justify-center items-center duration-1000 transition-all">
                    <Lottie
                      isClickToPauseDisabled={true}
                      height={100}
                      width={100}
                      options={animationDefaultOptions}
                    />
                    <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                      <h3 className="poppins-medium">Hi<span className="text-purple-500">!</span> Search New <span className="text-purple-500">Contact.</span></h3>
                    </div>
                  </div>
                }
            </DialogContent>
        </Dialog>
    </>
  )
}

export default NewDM