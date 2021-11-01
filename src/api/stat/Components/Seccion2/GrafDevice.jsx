import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { Segment } from 'semantic-ui-react';

const grafDevice = () => {
    <Segment inverted style={{ height: '50vh', width: '100%' }}>
        <ResponsiveContainer width='100%' height='100%'>
            <Line
                data={{
                    labels: ['1', '2', '3', '4'],
                    datasets: [
                        {
                            label: 'dona',
                            data: [100, 120, 400, 200, 130, 300, 400],
                            borderColor: [
                                '#f16623'
                            ],
                        },
                    ],
                }}
                height={'150 !important'}
                width={'125 !important'}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    Responsive: true,
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                    layout: {
                        padding: 0,
                    },
                    legend: {
                        labels: {
                            fontSize: 25,
                        },
                    },
                }
                }
            />
        </ResponsiveContainer>

    </Segment>
}

export default grafDevice;