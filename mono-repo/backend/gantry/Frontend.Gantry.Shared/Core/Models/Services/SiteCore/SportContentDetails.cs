using System;
using System.Collections.Generic;
using System.Text;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class SportContentDetails
    {
        public ContentParameters ContentParameters { get; set; } = null!;
        public object HorseRacingImage { get; internal set; }
        public object GreyHoundRacingImage { get; internal set; }
        public object BoxingImage { get; internal set; }
        public object CricketWhiteImage { get; internal set; }
        public object CricketRedImage { get; internal set; }
        public object DartsImage { get; internal set; }
        public object FootballImage { get; internal set; }
        public object FormulaRacingImage { get; internal set; }
        public object GolfImage { get; internal set; }
        public object NflImage { get; internal set; }
        public object RugbyLeagueImage { get; internal set; }
        public object RugbyUnionImage { get; internal set; }
        public object SnookerImage { get; internal set; }
        public object TennisImage { get; internal set; }
        public object SpecialsImage { get; internal set; }
        public object PoliticsImage { get; internal set; }
        public object OlympicsImage { get; internal set; }
        public object CyclingImage { get; internal set; }
        public object EntertainmentImage { get; internal set; }
    }
}