'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#57534e', '#f5f5f4']; // stone-800 for Paid, stone-300 for Remaining


const BudgetPieChart = ({ totalBudget, paidAmount }) => {
  const remaining = totalBudget - paidAmount;

  const data = [
    { name: 'Paid', value: paidAmount },
    { name: 'Remaining', value: remaining < 0 ? 0 : remaining },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full px-6 mt5"
    >

      <div className="relative h-52 bg-stone-300 rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              paddingAngle={8}
              animationDuration={1000}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-stone-500">Paid</p>
            <p className="text-2xl font-bold text-stone-800">
              ₹{paidAmount}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetPieChart;
