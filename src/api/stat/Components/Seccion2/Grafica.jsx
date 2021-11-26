import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { Segment } from 'semantic-ui-react';

const Grafica = () => {
    return (
        <Segment inverted className='graficoLineal' style={{width: '99%'}}>
            <ResponsiveContainer>
                <Line
                    data={{
                        labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fry', 'Sat', 'Sun'],
                        datasets: [
                            {
                                label: 'pepe',
                                data: [100, 120, 400, 200, 130, 300, 400],
                                borderColor: [
                                    '#f16623'
                                ],
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
                            }
                        },
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



// const Grafica = (day, week, month, year) => {
//     const [data, setData] = ([
//         {
//             name: 'objeto',
//             installed: '454654',

//         }
//     ]);
//     return (
//         <Segment>
//             <ResponsiveContainer width="100%" height="100%" >
//                 <Line
//                     width={500}
//                     height={300}
//                     data={data}
//                     margin={{
//                         top: 5,
//                         right: 30,
//                         left: 20,
//                         bottom: 5,
//                     }}
//                 />
//             </ResponsiveContainer>
//         </Segment>
//     )
// }


// class Grafica extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             chartData: {
//                 labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fry', 'Sat', 'Sun'],
//                 datasets: [
//                     {
//                         label: 'Label de mientras descubro como lo saco',
//                         data: [
//                             100,
//                             200,
//                             400,
//                             250,
//                             300,
//                             50,
//                             100,
//                         ],
//                         borderColor: [
//                             '#f16623'
//                         ]


//                     }
//                 ]
//             }
//         }
//     }

//     render() {
//         return (
//             <>
//                 <Segment inverted>
//                     <Line
//                         data={this.state.chartData}
//                         options={{
//                             maintainAspectRatio: false
//                         }}
//                     />
//                 </Segment>
//             </>
//         )
//     }
// }

export default Grafica;