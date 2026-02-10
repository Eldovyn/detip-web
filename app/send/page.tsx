import NavBar from "@/components/NavBar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const users = [
    { id: 1, name: "User 1", avatar: "https://github.com/shadcn.png" },
    { id: 2, name: "User 2", avatar: "https://github.com/shadcn.png" },
    { id: 3, name: "User 3", avatar: "https://github.com/shadcn.png" },
];

const SendPage = () => {
    return (
        <>
            <NavBar />
            <section className="flex flex-col h-screen bg-white pt-10 gap-5">
                <form action="" className="w-[30%] mx-auto">
                    <p className="text-xl font-semibold">Kirim DTC</p>
                    <input type="email" placeholder="Nama Pengguna, Wallet Address" className="my-2 w-full px-3 py-2 border rounded-md bg-white" />
                </form>
                <div className="flex w-[30%] mx-auto gap-5">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex flex-col items-center gap-2"
                        >
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={user.avatar}
                                    className="w-full h-full object-cover"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="text-sm flex flex-col items-center">
                                <span>User</span>
                                <span>{user.id}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default SendPage