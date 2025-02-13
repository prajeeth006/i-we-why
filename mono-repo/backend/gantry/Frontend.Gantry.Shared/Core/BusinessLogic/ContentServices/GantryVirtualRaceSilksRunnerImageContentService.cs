using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using System;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{
    public interface IGantryVirtualRaceSilksRunnerImageContentService
    {
        VirtualRaceSilkRunnerImages GetVirtualRaceSilkRunnerImages(string meetingName, string eventType, string eventName);
    }
    public class GantryVirtualRaceSilksRunnerImageContentService : IGantryVirtualRaceSilksRunnerImageContentService
    {
        private readonly IGantryVirtualRaceSilkImages _gantryVirtualRaceSilkImages;
        public GantryVirtualRaceSilksRunnerImageContentService(IGantryVirtualRaceSilkImages gantryVirtualRaceSilkImages)
        {
            _gantryVirtualRaceSilkImages = gantryVirtualRaceSilkImages;
        }
        public VirtualRaceSilkRunnerImages GetVirtualRaceSilkRunnerImages(string meetingName, string eventType, string eventName)
        {
            VirtualRaceSilkRunnerImages silkImages = new VirtualRaceSilkRunnerImages();
            string imageUrl = string.Empty;

            var virtualSilksMappingBasedOnMeetingNames = _gantryVirtualRaceSilkImages.VirtualSilksMappingBasedOnMeetingNames;

            string virtualRaceProviderName = "";

            foreach (var configMeetingNames in virtualSilksMappingBasedOnMeetingNames)
            {
                if (!string.IsNullOrEmpty(configMeetingNames.Value))
                {
                    var configMeetingList = configMeetingNames.Value.Split(',');
                    foreach (var configMeetingName in configMeetingList)
                    {
                        if (!string.IsNullOrEmpty(eventName))
                        {
                            if (eventName.Contains(configMeetingName))
                            {
                                virtualRaceProviderName = configMeetingNames.Key;
                                break;
                            }
                            else
                            {
                                if (!string.IsNullOrEmpty(meetingName) && meetingName.Contains(configMeetingName))
                                {
                                    virtualRaceProviderName = configMeetingNames.Key;
                                    break;
                                }
                            }
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(meetingName) && meetingName.Contains(configMeetingName))
                            {
                                virtualRaceProviderName = configMeetingNames.Key;
                                break;
                            }
                        }
                    }
                }

            }

            if (!string.IsNullOrEmpty(virtualRaceProviderName))
            {
                imageUrl = _gantryVirtualRaceSilkImages.GetType()?.GetProperty(virtualRaceProviderName)?.GetValue(_gantryVirtualRaceSilkImages)?.ToString();
            }

            if (!string.IsNullOrEmpty(imageUrl))
            {
                if (!string.IsNullOrEmpty(eventType) && eventType == "1")
                {
                    for (int i = 1; i < 11; i++)
                    {
                        silkImages = GenerateImageUrls(silkImages, imageUrl, i.ToString(), 0, 0);
                    }
                }
                else if (!string.IsNullOrEmpty(eventType) && eventType == "3")
                {
                    for (int i = 1; i < 13; i++)
                    {                       
                        var runnerNumber = i.ToString().PadLeft(4, '0');                       
                        silkImages = GenerateImageUrls(silkImages, imageUrl, runnerNumber, 0, 0);
                    }
                }
                else
                {
                    for (int i = 1; i < 41; i++)
                    {
                        silkImages = GenerateImageUrls(silkImages, imageUrl, i.ToString(), 0, 0);
                    }
                }
            }
            return silkImages;
        }

        private VirtualRaceSilkRunnerImages GenerateImageUrls(VirtualRaceSilkRunnerImages silkImages, string imageUrl, string runnerNumber, int imageWidth, int imageHeight)
        {
            silkImages.RunnerImages.Add(new ContentImage(imageUrl.Replace("<selectionNumber>", runnerNumber), runnerNumber, 0, 0));

            return silkImages;
        }
    }
}