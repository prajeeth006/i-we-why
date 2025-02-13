using Frontend.Vanilla.Content.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Content
{
    /// <summary>
    /// Represents a single vn icon item.
    /// </summary>
    public class VnIcon
    {
        /// <summary>
        /// Name of the icon item.
        /// </summary>
        public string IconName { get; set; }

        /// <summary>
        /// Additional css class.
        /// </summary>
        public string ExtraClass { get; set; }

        /// <summary>
        /// Color to fill the icon.
        /// </summary>
        public string FillColor { get; set; }

        /// <summary>
        /// Content image selected for icon.
        /// </summary>
        public ContentImage Image { get; set; }

        /// <summary>
        /// Size of icon.
        /// </summary>
        public string Size { get; set; }

        /// <summary>
        /// Size of icon.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Image url in case added as parameter.
        /// </summary>
        public string ImageUrl { get; set; }
    }
}
