const SkeletonInput = ({ className = '' }: { className?: string }) => (
    <div className={`h-10 bg-gray-200 rounded-md animate-pulse ${className}`}></div>
);

const SkeletonSelect = () => (
    <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
);

const SkeletonButton = () => (
    <div className="h-10 bg-blue-200 rounded-md w-32 animate-pulse"></div>
);

const BorrowItemSkeletonLoader = () => {
    return (
        <div className="w-full bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8 ring-1 ring-gray-100">
            <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-64 mb-8 animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Item ID */}
                <div className="md:col-span-2">
                    <div className="h-5 bg-gray-200 rounded-md w-20 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Item Name */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-20 mb-2 animate-pulse"></div>
                    <SkeletonSelect />
                </div>

                {/* Borrower First Name */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-32 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Borrower Last Name */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-32 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Borrower Role */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-24 mb-2 animate-pulse"></div>
                    <SkeletonSelect />
                </div>

                {/* Teacher's First Name */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-36 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Teacher's Last Name */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-36 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Student ID Number */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-28 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Room */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-16 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Subject/Time/Schedule */}
                <div className="md:col-span-2">
                    <div className="h-5 bg-gray-200 rounded-md w-40 mb-2 animate-pulse"></div>
                    <SkeletonInput />
                </div>

                {/* Remarks */}
                <div>
                    <div className="h-5 bg-gray-200 rounded-md w-24 mb-2 animate-pulse"></div>
                    <div className="h-24 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
                <SkeletonButton />
                <SkeletonButton />
            </div>
        </div>
    );
};

export default BorrowItemSkeletonLoader;
