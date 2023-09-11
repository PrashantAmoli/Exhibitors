import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

export const TransactionsTable = () => {
	const [transactions, setTransactions] = useState([]);

	const { user } = useUser();
	const email = user.primaryEmailAddress.emailAddress;

	const getTransactions = async () => {
		const { data: transactions, error } = await supabase
			.from('transactions')
			.select('*')
			.order('created_at', { ascending: false })
			.eq('email', email);
		if (error) console.log(error);
		else setTransactions(transactions);
	};

	useEffect(() => {
		getTransactions();
	}, []);

	return (
		<>
			<section className="w-full mx-auto my-3 overflow-y-auto">
				<h3 className="text-lg font-semibold">Transactions for {email}</h3>
				<div className="grid grid-cols-1 p-2">
					{transactions.map(transaction => (
						<div className="p-2 m-2 border rounded" key={transaction.id}>
							<p className="overflow-x-auto break-keep">{JSON.stringify(transaction)}</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
};
