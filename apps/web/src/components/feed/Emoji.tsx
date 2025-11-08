import { Smile } from 'lucide-react'
import {
    EmojiPicker,
    EmojiPickerSearch,
    EmojiPickerContent,
    EmojiPickerFooter,
} from '@repo/ui/components/ui/emoji-picker'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { useState } from 'react';

interface EmojiProps {
    onEmojiSelect: (emoji: string) => void;
}

export default function Emoji({ onEmojiSelect }: EmojiProps) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                    <button className='bg- p-2 rounded-lg text-black shadow-none  text-5xl hover:bg-purple-50' >
                        <Smile color='purple' /></button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                    <EmojiPicker
                        className="h-[342px]"
                        onEmojiSelect={({ emoji }) => {
                            onEmojiSelect(emoji)
                            setIsOpen(false);
                        }}
                    >
                        <EmojiPickerSearch />
                        <EmojiPickerContent />
                        <EmojiPickerFooter />
                    </EmojiPicker>
                </PopoverContent>
            </Popover>

        </div>
    )
}
