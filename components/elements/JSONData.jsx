import { CaretSortIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '@/lib/utils';

export const JSONData = ({ trigger = 'JSON', json, className, children, ...props }) => {
	return (
		<>
			<Collapsible className={cn('', className)}>
				<CollapsibleTrigger>
					<Button variant="ghost" size="sm" className="gap-1">
						<span className="">{trigger}</span>
						<CaretSortIcon className="w-4 h-4" />
					</Button>
				</CollapsibleTrigger>

				<CollapsibleContent className="overflow-auto break-words">
					{json ? <pre className="break-words">{JSON.stringify(json, null, 2)}</pre> : null}

					{children}
				</CollapsibleContent>
			</Collapsible>
		</>
	);
};
