import React from 'react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../reusable/XWSelect'
import { useSocialPreview } from '../../../_context/social-preview-provider'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect'

const LinkedInPreview = ({ text, images }: { text: string, images: string[] }) => (
    <div className="max-w-[550px] w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image src="/images/user2.png" alt="Profile" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-semibold text-[16px] text-gray-900 hover:text-blue-600 hover:underline cursor-pointer">
                            Account Not Connected
                        </div>
                        <div className="text-gray-500 text-[14px]">350 Followers</div>
                        <div className="flex items-center gap-1 text-gray-500 text-[12px]">
                            <span>8h</span>
                            <span>•</span>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM3.668 2.501l-.288.646a.847.847 0 0 0 1.479.815l.245-.368a.809.809 0 0 1 1.034-.275.809.809 0 0 1 .397.934l-.68 2.493a.809.809 0 0 0 .961.96l.058-.016a.869.869 0 0 1 1.085.573.869.869 0 0 1-.122 1.344l-.24.209a.847.847 0 0 0 .856 1.42l.138-.052a.869.869 0 0 1 1.182.337.869.869 0 0 1-.102 1.251l-1.616 1.315a.847.847 0 0 0 1.054 1.325l2.129-.937a8.003 8.003 0 0 0 1.02-2.89.847.847 0 0 0-.474-1.213l-2.679-1.67a.869.869 0 0 1-.489-1.017.869.869 0 0 1 .936-.736l2.047.454a.847.847 0 0 0 .988-.435l.365-1.074a.847.847 0 0 0-.645-1.113l-2.517-.443a.869.869 0 0 1-.766-.917.869.869 0 0 1 .892-.798l1.293.09a.847.847 0 0 0 .902-.732l.125-1.214a.847.847 0 0 0-.725-.935l-1.257-.134a.869.869 0 0 1-.775-.89.869.869 0 0 1 .817-.855l1.149-.062a.847.847 0 0 0 .768-.996l-.156-1.217a.847.847 0 0 0-1.012-.722l-1.124.184a.869.869 0 0 1-.991-.594.869.869 0 0 1 .519-1.017l.977-.409a.847.847 0 0 0 .426-1.166l-.201-.418A7.973 7.973 0 0 0 8 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <button className="text-gray-500 p-1 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>

            <div className="mt-3 text-[14px] text-gray-900 whitespace-pre-wrap">{text}</div>
        </div>

        {/* Images */}
        {images.length > 0 && (
            <div className={`grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-[2px] bg-gray-100`}>
                {images.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] relative">
                        <Image src={img} alt="Post image" fill className="object-cover" />
                    </div>
                ))}
            </div>
        )}

        {/* Social Counts */}
        <div className="px-4 pt-1 pb-2 flex items-center justify-between">
            <button className="flex items-center gap-1 group">
                <div className="flex -space-x-1">
                    <div className="w-[16px] h-[16px] rounded-full bg-[#0a66c2] flex items-center justify-center border-2 border-white">
                        <svg className="w-[10px] h-[10px] text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 01-.46 2.85L6.7 9.91a8.27 8.27 0 01-2.54 3.42l-2 1.58a2.74 2.74 0 00-1 2.13V19a2.75 2.75 0 002.75 2.75h13.5A2.75 2.75 0 0020 19v-5.5a2.75 2.75 0 00-1.04-2.15l-.54-.35z" />
                        </svg>
                    </div>
                    <div className="w-[16px] h-[16px] rounded-full bg-[#672f99] flex items-center justify-center border-2 border-white">
                        <svg className="w-[10px] h-[10px] text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                        </svg>
                    </div>
                </div>
                <span className="text-gray-500 text-[13px] group-hover:text-[#0a66c2] group-hover:underline">113</span>
            </button>
            <div className="text-gray-500 text-[13px]">
                <button className="hover:text-[#0a66c2] hover:underline">10 comments</button>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="px-2 py-1 flex items-center justify-between border-t border-gray-200">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className="text-gray-600 text-[14px] font-medium">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-gray-600 text-[14px] font-medium">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-gray-600 text-[14px] font-medium">Repost</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-gray-600 text-[14px] font-medium">Send</span>
            </button>
        </div>
    </div>
)

const TwitterPreview = ({ text, images }: { text: string, images: string[] }) => (
    <div className="max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image src="/images/user2.png" alt="Profile" fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <div className="font-bold text-[14px] text-black hover:underline">Account Not Connected</div>
                                <div className="text-[13px] text-gray-500">@user_name</div>
                                <div className="text-[13px] text-gray-500">·</div>
                                <div className="text-[13px] text-gray-500">Oct 12</div>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:text-blue-500 p-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-1 text-[15px] text-black whitespace-pre-wrap">{text}</div>

                    {images.length > 0 && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100">
                            <div className={`grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-0.5`}>
                                {images.map((img, idx) => (
                                    <div key={idx} className="aspect-square relative">
                                        <Image src={img} alt="Post image" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between max-w-md text-gray-500">
                        <button className="hover:text-blue-500 flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.045.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.368-3.43-7.788-7.8-7.79zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.334-.75-.75-.75h-.395c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                        <button className="hover:text-green-500 flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                        <button className="hover:text-red-500 flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
                                    fill="currentColor" />
                            </svg>
                            <span className="text-sm">17</span>
                        </button>
                        <button className="hover:text-blue-500 flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.073.53-.22c.293-.293.293-.767 0-1.06z"
                                    fill="currentColor" />
                                <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const FacebookPreview = ({ text, images }: { text: string, images: string[] }) => (
    <div className="max-w-[500px] w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full overflow-hidden relative">
                        <Image src="/images/user2.png" alt="Profile" fill className="object-cover" />
                    </div>
                    <div>
                        <div className="font-semibold text-[14px] text-black">Account Not Connected</div>
                        <div className="flex items-center gap-1 text-gray-400 text-[12px]">
                            <span>October 11</span>
                            <span>·</span>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 p-1 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            {/* Post Text */}
            <div className="mt-2 text-[14px] text-black">{text}</div>
        </div>

        {/* Image */}
        {images.length > 0 && (
            <div className="relative">
                <Image
                    src={images[0] as string}
                    alt="Post image"
                    width={500}
                    height={300}
                    className="w-full object-cover"
                />
            </div>
        )}

        {/* Reactions Count Bar */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#2078F4] flex items-center justify-center">
                        <svg className="w-[12px] h-[12px] text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046z" />
                        </svg>
                    </div>
                    <div className="w-[18px] h-[18px] rounded-full bg-[#F33E58] flex items-center justify-center">
                        <svg className="w-[12px] h-[12px] text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                        </svg>
                    </div>
                    <div className="w-[18px] h-[18px] rounded-full bg-[#F7B125] flex items-center justify-center">
                        <svg className="w-[12px] h-[12px] text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM4.146 6.354l.894.894L7.5 4.793l2.46 2.46.894-.894L7.5 3.004 4.146 6.354z" />
                        </svg>
                    </div>
                </div>
                <span className="text-gray-400 text-[13px]">177</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-[13px]">
                <span>42 Comments</span>
                <span>5 Shares</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="px-3 py-1 flex items-center justify-between">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-md">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 11v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h3zm10 0v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-7a1 1 0 011-1h3zm-3-5V4a1 1 0 00-1-1H8a1 1 0 00-1 1v2a1 1 0 001 1h5a1 1 0 001-1z" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-gray-400 text-[15px] font-medium">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-md">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-gray-400 text-[15px] font-medium">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-md">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-gray-400 text-[15px] font-medium">Share</span>
            </button>
        </div>
    </div>
)

const InstagramPreview = ({ text, images }: { text: string, images: string[] }) => (
    <div className="max-w-[470px] w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full overflow-hidden relative">
                    <Image src="/images/user2.png" alt="Profile" fill className="object-cover" />
                </div>
                <div className="font-semibold text-[14px] text-black">Account Not Connected</div>
            </div>
            <button className="text-black p-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
            </button>
        </div>

        {/* Image */}
        {images.length > 0 && (
            <div className="aspect-square relative">
                <Image src={images[0] as string} alt="Post image" fill className="object-cover" />
            </div>
        )}

        {/* Action Buttons and Image Dots */}
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button className="text-black hover:opacity-70">
                        <svg aria-label="Like" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="text-black hover:opacity-70">
                        <svg aria-label="Comment" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="text-black hover:opacity-70">
                        <svg aria-label="Share" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 3 9.218 10.083M11.698 20.334 22 3.001H2l7.218 7.083 2.48 10.25z" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Image Dots */}
                <div className="flex-1 flex justify-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                </div>

                <button className="text-black hover:opacity-70">
                    <svg aria-label="Save" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21 12 13.44 4 21V3h16v18z" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-2 mb-2">
                <div className="flex -space-x-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white relative">
                        <Image src="/images/user10.png" alt="Liker" fill className="rounded-full object-cover" />
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-white relative">
                        <Image src="/images/user2.png" alt="Liker" fill className="rounded-full object-cover" />
                    </div>
                </div>
                <p className="text-sm text-black">
                    Liked by <span className="font-semibold">John Smith</span> and <span className="font-semibold">12 others</span>
                </p>
            </div>

            {/* Caption */}
            <div className="text-sm">
                <span className="font-semibold text-black mr-2">Account Not Connected</span>
                <span className="text-black">{text}</span>
            </div>

            {/* Date */}
            <div className="mt-1 text-xs text-xw-muted">
                1 November
            </div>
        </div>
    </div>
)

const SocialMediaPreviewer = () => {
    const { selectedPreview, setSelectedPreview, postText, images } = useSocialPreview()

    const PreviewComponent = {
        linkedin: LinkedInPreview,
        twitter: TwitterPreview,
        facebook: FacebookPreview,
        instagram: InstagramPreview
    }[selectedPreview]

    return (
        <div className='h-full w-full'>
            <div className='p-3 flex items-center justify-end gap-2'>
                <div className='text-sm text-xw-muted'>
                    Post preview selector:
                </div>
                <div>
                    <Select value={selectedPreview} onValueChange={(value: any) => setSelectedPreview(value)}>
                        <SelectTrigger className='h-9 max-w-[200px] w-full'>
                            <SelectValue placeholder='Select a post preview' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-center h-[calc(100%-60px)]">
                <PreviewComponent text={postText} images={images} />
            </div>
        </div>
    )
}

export default SocialMediaPreviewer
