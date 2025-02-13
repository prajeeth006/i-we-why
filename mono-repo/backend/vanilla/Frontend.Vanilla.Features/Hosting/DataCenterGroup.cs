using Ardalis.SmartEnum;

namespace Frontend.Vanilla.Features.Hosting;

internal class DataCenterGroup : SmartEnum<DataCenterGroup, string>
{
    public static readonly DataCenterGroup Default = new (nameof(Default), "default");
    public static readonly DataCenterGroup Brazil = new (nameof(Brazil), "Brazil");

    private DataCenterGroup(string name, string value)
        : base(name, value)
    {
    }
}
