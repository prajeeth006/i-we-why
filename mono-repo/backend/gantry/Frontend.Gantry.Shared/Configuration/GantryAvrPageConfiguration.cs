using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryAvrPageConfiguration
    {
        public decimal DogCountdownToOffTime { get; }

        public decimal DogPreambleTime { get; }

        public decimal DogVideoTime { get; }

        public decimal DogResultTime { get; }

        public decimal DogDelayTime { get; }

        public decimal HorseCountdownToOffTime { get; }

        public decimal HorsePreambleTime { get; }

        public decimal HorseVideoTime { get; }
        public decimal JumpHorseVideoTime { get; }

        public decimal HorseResultTime { get; }
        public decimal jumpHorseResultTime { get; }

        public decimal HorseDelayTime { get; }
        public decimal MotorCountdownToOffTime { get; }

        public decimal MotorPreambleTime { get; }

        public decimal MotorVideoTime { get; }

        public decimal MotorResultTime { get; }

        public decimal MotorDelayTime { get; }

        public decimal OffTime { get; }

    }
    public class GantryAvrPageConfiguration : IGantryAvrPageConfiguration
    {
        public decimal DogCountdownToOffTime { get; set; }

        public decimal DogPreambleTime { get; set; }

        public decimal DogVideoTime { get; set; }

        public decimal DogResultTime { get; set; }

        public decimal DogDelayTime { get; set; }

        public decimal HorseCountdownToOffTime { get; set; }

        public decimal HorsePreambleTime { get; set; }

        public decimal HorseVideoTime { get; set; }
        public decimal JumpHorseVideoTime { get; set; }

        public decimal HorseResultTime { get; set; }
        public decimal jumpHorseResultTime { get; set; }

        public decimal HorseDelayTime { get; set; }
        public decimal MotorCountdownToOffTime { get; set; }

        public decimal MotorPreambleTime { get; set; }

        public decimal MotorVideoTime { get; set; }

        public decimal MotorResultTime { get; set; }

        public decimal MotorDelayTime { get; set; }

        public decimal OffTime { get; set; }
    }

    public interface IGantryAvrPageOverlay
    {
        public bool IsOverlay { get; }
    }

    public class GantryAvrPageOverlay : IGantryAvrPageOverlay
    {
        public bool IsOverlay { get; set; } = true;
    }

    public interface IGantryAvrControllerBasedTimings
    {
        public Dictionary<string, GantryAvrPageConfiguration> AvrPageTimingsBasedOnControllerId { get; }
        public Dictionary<string, GantryAvrPageOverlay> AvrVideoOverlayBasedOnControllerId { get; }
    }

    public class GantryAvrControllerBasedTimings : IGantryAvrControllerBasedTimings
    {
        public Dictionary<string, GantryAvrPageConfiguration> AvrPageTimingsBasedOnControllerId { get; set; }
        public Dictionary<string, GantryAvrPageOverlay> AvrVideoOverlayBasedOnControllerId { get; set; }
    }

    public class AvrPageConfiguration
    {
        public GantryAvrPageConfiguration gantryAvrPageConfiguration { get; set; }
        public GantryAvrPageOverlay gantryAvrPageOverlay { get; set; }
    }
}
