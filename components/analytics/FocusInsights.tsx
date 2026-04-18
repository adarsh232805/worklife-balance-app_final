"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function FocusInsights({ data, range }: { data: any[], range: string }) {
    const isHourly = range === 'day';

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 capitalize">{range}ly Focus Trends</h3>
                    <p className="text-sm text-slate-500">
                        {isHourly ? 'Deep work sessions hour-by-hour' : `Deep work sessions over the last ${range === 'month' ? '30 days' : '7 days'}`}
                    </p>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {isHourly ? (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="minutes"
                                fill="#6366f1"
                                radius={[4, 4, 4, 4]}
                            />
                        </BarChart>
                    ) : (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="minutes"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorFocus)"
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
