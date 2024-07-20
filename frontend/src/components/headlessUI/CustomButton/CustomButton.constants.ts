import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'rounded-md shadow-inner shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase',
  {
    variants: {
      variant: {
        default:
          'w-full px-5 py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-500 focus:ring-4 focus:outline-none hover:bg-cyan-600 focus:ring-cyan-600',
        primary:
          'w-full px-5 py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-cyan-600 focus:ring-4 focus:outline-none hover:bg-cyan-700 focus:ring-cyan-700',
        secondary:
          'inline-flex items-center justify-center gap-2 py-1.5 px-3 font-semibold text-gray-100 hover:text-slate-950 text-sm/6 bg-transparent border border-gray-100 focus:outline-none hover:bg-gray-100',
        outline:
          'inline-flex items-center gap-2 py-1.5 px-3 font-semibold text-gray-100 hover:text-slate-950 text-sm/6 bg-transparent border border-gray-100 focus:outline-none hover:bg-gray-100',
        payment:
          'w-full px-5 py-2.5 text-xs lg:text-sm font-medium text-center text-gray-100 rounded-lg bg-green-500 focus:ring-4 focus:outline-none hover:bg-green-600 focus:ring-green-600',
        dialog:
          'inline-flex items-center gap-2 py-1.5 px-3 font-semibold text-white text-sm/6 bg-gray-700 data-[hover]:bg-gray-600 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
