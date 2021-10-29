import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Segment } from 'semantic-ui-react';

class Grafica extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fry', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Label de mientras descubro como lo saco',
                        data: [
                            100,
                            200,
                            400,
                            250,
                            300,
                            50,
                            100,
                        ],
                        borderColor: [
                            '#f16623'
                        ]


                    }
                ]
            }
        }
    }

    render() {
        return (
            <>
                <Segment inverted>
                    <Line
                        data={this.state.chartData}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                </Segment>
            </>
        )
    }
}

export default Grafica;