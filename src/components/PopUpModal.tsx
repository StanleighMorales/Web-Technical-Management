type PopUpModalProps = {
    title: string,
    label: string,
    noun: string
    destination?: string,
    onHandleCancleAction: () => void,
    onHandleConfirmAction: () => void
};

export default function PopUpModal({ title,label,noun, destination, onHandleCancleAction, onHandleConfirmAction }: PopUpModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onHandleCancleAction} />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="mb-6 text-sm text-gray-600">Are you sure you want to {label} this {noun}? This action can be reversed from the {destination}.</p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={onHandleCancleAction}
                        title="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="rounded-md bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700"
                        onClick={onHandleConfirmAction}
                        title="Confirm archive"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
