namespace WiredBrainApi.Services
{
    public interface IInventoryService
    {
        LocationInventory? GetLocationInventory(int locationId);
    }
}