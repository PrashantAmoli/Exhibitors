import { Dialog, Transition } from '@headlessui/react';
import { Fragment, Suspense } from 'react';

export default function Modal({ modalOpen, setModalOpen, slot, exhibitionData, slotsData, title, children }) {
	function handleClose() {
		setModalOpen(false);
	}

	function handleOpen() {
		setModalOpen(true);
	}

	return (
		<>
			<Transition appear show={modalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={handleClose}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex items-center justify-center min-h-full p-1.5 text-center sm:p-6">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-50"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-50"
							>
								<Dialog.Panel className="w-full sm:max-w-screen-2xl flex flex-col justify-center h-[92vh] sm:min-h-[92vh] max-h-[92vh] transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl p-1 pt-2.5 sm:p-2 text-left align-middle shadow-xl transition-all select-none border border-blue-950">
									<Dialog.Title as="h3" className="fixed flex justify-center w-full text-lg font-semibold text-center gap-x-2 top-1">
										{/* <svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											className="flex w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
											/>
										</svg> */}
										{title || 'Book a slot'}
									</Dialog.Title>

									{/* <Suspense fallback={<div>Loading...</div>}>
										<iframe
											data-tally-src="https://tally.so/embed/wvrkGD?hideTitle=1&transparentBackground=1&dynamicHeight=0"
											loading="eager"
											width="100%"
											height="900"
											frameborder="0"
											marginheight="0"
											marginwidth="0"
											title="EME: PoC"
											className="relative z-20 overflow-y-scroll .hide-scrollbar"
											onLoad={() => {
												Tally.loadEmbeds();
												console.log('TallyLoaded');
											}}
										/>

										<p className="text-center">In-case of any problem try contacting support</p>
									</Suspense> */}

									{/* <BookingForm slot={slot} exhibitionData={exhibitionData} slotsData={slotsData} /> */}

									<div className="grid grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">{children}</div>

									<div className="absolute z-20 top-2 right-2 backdrop-blur-md">
										<button
											type="button"
											className="inline-flex justify-center p-1 font-extrabold border rounded-full border-blue-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:scale-105"
											onClick={handleClose}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
												{/* Close button */}
											</svg>
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
