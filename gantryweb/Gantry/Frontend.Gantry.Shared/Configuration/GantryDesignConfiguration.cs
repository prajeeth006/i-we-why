using System;
using System.Collections.Generic;
using System.Text;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryDesignConfiguration
    {
        public bool IsNewDesignEnabled { get; }
    }
    public class GantryDesignConfiguration: IGantryDesignConfiguration
    {
        public bool IsNewDesignEnabled { get; set; }
    }
}
