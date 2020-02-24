import React, {Component} from 'react';
import {
  Segment,
  Image,
  Header,
    Icon,
    List,
} from 'semantic-ui-react';

export default class storyPreview extends Component {
    constructor(props) {
      super(props);
      this.state = {
        device: 'mobile', // tablet
        disposition: 'vertical', // horizontal
        loading: false,
        styleSheet: {
          mobileContainer: {
            color: '#FFF',
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 0
          },
          tile: {
            background: 'transparent url('+ props.server+props.theme.banner.path+') no-repeat top left',
          },
          tileTitle: {
            fontFamily: props.font1,
            color: props.color1,
          },
        }
      }
    }
    render() {
    const {styleSheet, device, disposition, loading} = this.state;
    return (
      <Segment className="movile" style={styleSheet.mobileContainer}>
        <Header >
            <Icon name="home"/>
        </Header>
        <Segment vertical>
            <div vertical style={styleSheet.tile}>
                <h1>title</h1>
                <h2>City - Country</h2>
             </div>
            <Segment vertical className="text">
             <Segment vertical  className="sinopsys">
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                  ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                  magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                  ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                  quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                  arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                  Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                  dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                  Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                  Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                  viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                  Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                </p>
              </Segment>
              <Segment vertical  className="credits">
                <p>
                    Concepto y producción: Fulvio Capurso.
                    Guión: Sergio López Suárez, Javier Martínez y Fulvio Capurso.
                    Muralismo: Fulvio Capurso (aka Fulviet), David de la Mano, Jaime Molina, Lucas Butler (aka Demo), Rodrígo López (aka Lolo), Sebastián Salazar (aka Bastardo) y Hudson Henrique (aka Hudhen).
                    Escultura: Fulvio Capurso (aka Fulviet).
                    Asistencia de producción: Yves Cohen, Marcelo, Pablo y Brian
                    Fotografía: Cristóbal Severin, Flora Pozzobon, Sofía Casanova y Fulvio Capurso
                    Diseño visual e interactivo: Cristóbal Severin y Fulvio Capurso
                    Desarrollo: Martín Terragona
                    Animación: Alejo Schettini, Gachi García Díaz, Santiago Germano, Rodrigo López y Lucas Butler
                    3D: Rodrigo López
                    Música y sonido: Pablo Fagundez, Matías Nario y Betina Chavez
                    Grabaciones: Pablo Notaro
                    Colaboraciones instrumentales: Gonzalo Franco, Fernando Nathan, Mauricio Clavijo, Tato Garré, Ignacio Aldabe y Ben Leeb
                    Comunicación y prensa: Manu Rivoir
                    Agradecimientos: A los vecinos que cedieron alegremente sus fachadas para ser parte del cuento, a todos los niños y niñas que le pusieron voz a los personajes, a los artistas y amigos de Casa Wang, a   Ánima Espacio Cultural, a Javier, Maxi, Cris, Sofi, Nilo, a Alito y toda la banda de Radio Pedal, a Pablo, Tita, Samuel y Emma, a Alicia y su linda familia, a Satira, Fer y Elo, a Daniel y Efuka, a Anita, Doris y Boris, a todas las lindas personas que contribuyeron a la realización de este proyecto y por error no figuran en esta breve lista.

                    Apoyos:

                    Fondo Concursable para la cultura del Ministerio de Educación y Cultura

                    Roostudio

                    Anima Espacio Cultural
                </p>
              </Segment>
            </Segment>
        </Segment>
        <Segment >
            <List horizontal>
                <List.Item>
                    <Icon  name='trash'  />
                </List.Item>
                <List.Item>
                    <Icon  name='play'  />
                </List.Item>
                <List.Item>
                    <Icon  name='point'  />
                </List.Item>
            </List>
        </Segment>
      </Segment>
    )
  }
}
