//Pour le cpateur à ultrasons
int TriggerPin = 8; //Trig pin
int EchoPin = 5; //Echo pin
long distance;

void setup()
{
  Serial.begin(9600);
//Serial.println("Début SETUP");
//Mise en entrées de Pins

//On initialise le capteur à ultrasons
pinMode(TriggerPin, OUTPUT);
digitalWrite(TriggerPin, LOW);
pinMode(EchoPin, INPUT); 
 
delay(100);

Serial.println("Fin SETUP capteurs");  
}

void loop()
{
  
  distance= lire_distance();

  Serial.print("D"); 
  Serial.println(distance);
  //Envoi des données en BT : 

  delay(50);
  
}

long lire_distance()
{
  long lecture_echo;
  digitalWrite(TriggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(TriggerPin, LOW);
  lecture_echo = pulseIn(EchoPin, HIGH);
  long cm = lecture_echo / 58;
  //Serial.print("Distance en cm : ");
  //Serial.println(cm); 
  return(cm);
}

