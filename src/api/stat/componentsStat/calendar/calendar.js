import { createContext, useContext } from 'react';
import { CalendarContext } from './stats'

export default function FunctionContextComponent() {
    const minDate = useContext(CalendarContext)
}


const CalendarContext = (period) => createContext(period);

export default CalendarContext;
