import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { Segment } from 'semantic-ui-react';

const GraficaGeneral = () => {
    return (
        <Segment inverted >
            <ResponsiveContainer width='100%' height='100%'>
            <Line
                data={{
                    labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fry', 'Sat', 'Sun'],
                    datasets: [
                        {
                            data: [100, 120, 400, 200, 130, 300, 400],
                            borderColor: [
                                '#f16623'
                            ],
                        },
                    ],
                }}
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
    )
}

export default GraficaGeneral;